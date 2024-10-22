import Database, { Database as DatabaseType } from 'better-sqlite3'
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

      CREATE TABLE IF NOT EXISTS TestSuites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );

      CREATE TABLE IF NOT EXISTS Tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        code TEXT,
        summary TEXT,
        test_suite_id INTEGER,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_suite_id) REFERENCES TestSuites(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );

      CREATE TABLE IF NOT EXISTS TestResults (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id INTEGER,
        status TEXT NOT NULL,
        duration INTEGER,
        error_message TEXT,
        screenshot_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_id) REFERENCES Tests(id)
      );
    `)
  }

  create(table: string, data: Record<string, unknown>): number {
    if (!this.db) throw new Error('Database not initialized')

    const columns = Object.keys(data).join(', ')
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ')
    const values = Object.values(data)

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
    const stmt = this.db.prepare(query)
    const result = stmt.run(values)
    return result.lastInsertRowid as number
  }

  read(table: string, id: number): unknown {
    if (!this.db) throw new Error('Database not initialized')

    const query = `SELECT * FROM ${table} WHERE id = ?`
    const stmt = this.db.prepare(query)
    return stmt.get(id)
  }

  update(table: string, id: number, data: Record<string, unknown>): void {
    if (!this.db) throw new Error('Database not initialized')

    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
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

  list(table: string, conditions?: Record<string, unknown>): unknown[] {
    if (!this.db) throw new Error('Database not initialized')

    let query = `SELECT * FROM ${table}`
    const values: unknown[] = []

    if (conditions && Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(' AND ')
      query += ` WHERE ${whereClause}`
      values.push(...Object.values(conditions))
    }

    const stmt = this.db.prepare(query)
    return stmt.all(values)
  }
}
