import { BadRequestException, Injectable } from '@nestjs/common';
import { QuerySumDashboardDTO } from 'src/dto/QuerySumDashboardDTO';
import { Repository } from 'typeorm';

interface SumResult {
  [key: string]: any;
  total_sum: number;
}

@Injectable()
export class DashboardService {
  constructor() {}

  async sumData(
    queryDto: QuerySumDashboardDTO,
    repository: Repository<any>,
  ): Promise<any> {
    const { fields, table, startDate, endDate, joins, columnsToSum } = queryDto;

    if (!fields || fields.length === 0) {
      throw new BadRequestException('At least one field must be specified');
    }
    if (!table) {
      throw new BadRequestException('Table name must be specified');
    }
    if (!columnsToSum || columnsToSum.length === 0) {
      throw new BadRequestException(
        'At least one column to sum must be specified',
      );
    }

    let query = repository
      .createQueryBuilder(`'${table}'`)
      .select(fields.map((field) => `${table}.${field}`));

    if (joins && joins.length > 0) {
      joins.forEach((joinTable) => {
        query = query.leftJoinAndSelect(`${joinTable}`, joinTable);
      });
    }

    query = query
      .where(`${table}.date >= :startDate`, { startDate })
      .andWhere(`${table}.date <= :endDate`, { endDate });

    columnsToSum.forEach((column) => {
      query = query.addSelect(`SUM(${table}.${column})`, `sum_${column}`);
    });

    const totalSum = columnsToSum
      .map((col) => `COALESCE(SUM(${table}.${col}), 0)`)
      .join(' + ');
    query = query.addSelect(`(${totalSum})`, 'total_sum');

    const result: SumResult = await query.execute();
    return result;
  }
}
