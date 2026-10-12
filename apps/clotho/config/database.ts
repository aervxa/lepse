import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'postgres',

  connections: {
    /**
     * SQLite connection (default).
     */
    sqlite: {
      client: 'better-sqlite3',

      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },

      /**
       * Required by Knex for SQLite defaults.
       */
      useNullAsDefault: true,

      migrations: {
        /**
         * Sort migration files naturally by filename.
         */
        naturalSort: true,

        /**
         * Paths containing migration files.
         */
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        /**
         * Enable schema generation from Lucid models.
         */
        enabled: true,

        /**
         * Custom schema rules file paths.
         */
        rulesPaths: ['./database/schema_rules.js'],
      },
    },

    /**
     * PostgreSQL connection.
     * Install package to switch: npm install pg
     */
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
      },
      pool: { min: 0 }, // https://knexjs.org/guide/#pool:~:text=It%20is%20recommended%20to%20set%20min%3A%200%20so%20all%20idle%20connections%20can%20be%20terminated
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },

    /**
     * MySQL / MariaDB connection.
     * Install package to switch: npm install mysql2
     */
    // mysql: {
    //   client: 'mysql2',
    //   connection: {
    //     host: process.env.MYSQL_HOST,
    //     port: Number(process.env.MYSQL_PORT || 3306),
    //     user: process.env.MYSQL_USER,
    //     password: process.env.MYSQL_PASSWORD,
    //     database: process.env.MYSQL_DB_NAME,
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * Microsoft SQL Server connection.
     * Install package to switch: npm install tedious
     */
    // mssql: {
    //   client: 'mssql',
    //   connection: {
    //     server: process.env.MSSQL_SERVER,
    //     port: Number(process.env.MSSQL_PORT || 1433),
    //     user: process.env.MSSQL_USER,
    //     password: process.env.MSSQL_PASSWORD,
    //     database: process.env.MSSQL_DB_NAME,
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * libSQL (Turso) connection.
     * Install package to switch: npm install @libsql/sqlite3
     */
    // libsql: {
    //   client: 'libsql',
    //   connection: {
    //     filename: env.get('LIBSQL_HTTP_URL'),
    //   },
    //   useNullAsDefault: true,
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },
  },
})

export default dbConfig
