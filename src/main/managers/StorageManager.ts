import Database, { Database as DatabaseType } from 'better-sqlite3'
import _ from 'lodash'
import path from 'path'
import { app } from 'electron'

export class StorageManager {
  private db: DatabaseType | null = null

  initialize(): void {
    const dbPath = path.join(app.getPath('userData'), 'database.sqlite')
    this.db = new Database(dbPath)
    this.createTables()
  }

  private createTables(): void {
    if (!this.db) throw new Error('Database not initialized')

    this.db.exec(`

      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ScriptSuites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );

      CREATE TABLE IF NOT EXISTS Scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        summary TEXT,
        script_suite_id INTEGER,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (script_suite_id) REFERENCES ScriptSuites(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );

      CREATE TABLE IF NOT EXISTS ScriptBlocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        instruction TEXT,
        user_id INTEGER,
        script_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (script_id) REFERENCES Scripts(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );

      CREATE TABLE IF NOT EXISTS ScriptBlockResults (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        script_block_id INTEGER,
        status TEXT NOT NULL,
        duration INTEGER,
        error_message TEXT,
        screenshot_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (script_block_id) REFERENCES ScriptBlocks(id)
      );
    `)
  }

  create(table: string, data: Record<string, unknown>): number {
    if (!this.db) throw new Error('Database not initialized')

    const columns = Object.keys(data)
      .map((col) => _.snakeCase(col))
      .join(', ')
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ')
    const values = Object.values(data)

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
    const stmt = this.db.prepare(query)
    const result = stmt.run(values)
    return result.lastInsertRowid as number
  }

  read<T extends Record<string, unknown>>(table: string, id: number): unknown {
    if (!this.db) throw new Error('Database not initialized')

    const query = `SELECT * FROM ${table} WHERE id = ?`
    const stmt = this.db.prepare(query)
    return transformFieldsToCamelCase(stmt.get(id) as T)
  }

  update(table: string, id: number, data: Record<string, unknown>): void {
    if (!this.db) throw new Error('Database not initialized')

    const setClause = Object.keys(data)
      .map((key) => `${_.snakeCase(key)} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]

    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`
    const stmt = this.db.prepare(query)
    stmt.run(values)
  }

  delete(table: string, id: number): void {
    if (!this.db) throw new Error('Database not initialized')

    const query = `DELETE FROM ${table} WHERE id = ?`
    const stmt = this.db.prepare(query)
    stmt.run(id)
  }

  list<T extends Record<string, unknown>>(
    table: string,
    conditions?: Record<string, unknown>
  ): T[] {
    if (!this.db) throw new Error('Database not initialized')

    let query = `SELECT * FROM ${table}`
    const values: unknown[] = []

    if (conditions && Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `${_.snakeCase(key)} = ?`)
        .join(' AND ')
      query += ` WHERE ${whereClause}`
      values.push(...Object.values(conditions))
    }

    const stmt = this.db.prepare(query)
    return stmt.all(values).map((data) => transformFieldsToCamelCase(data as T))
  }
}

function transformFieldsToCamelCase<T extends Record<string, unknown>>(data: T): T {
  return _.mapKeys(data, (_value, key) => _.camelCase(key)) as T
}
