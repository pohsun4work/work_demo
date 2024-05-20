import { Knex } from 'knex'
import { PickPartial } from '@/type.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    // <查, 增, 改>
    user: Knex.CompositeTableType<user, user, Omit<user, 'account'>>
    following: Knex.CompositeTableType<following, following, never>
  }

  interface user {
    account: string
    password: string
    name: string
    email: string
    city_c: number
  }

  interface following {
    account: string
    following_account: string
  }
}
