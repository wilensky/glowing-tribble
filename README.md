# :heavy_check_mark: NO AI TOOLS HAS BEEN USED :heavy_check_mark:

#### Run

```sh
npx tsx main.ts
```

#### Explanation

Solution is based on preventing parallel processing of a single group (_aka `message.key`_).
Messages of separate groups are allowed to be processed in parallel but messages of same group only sequentially.

> Comments are left in the code as a part of explanation

> `__idle__: ${number}` item appears in the resulting dataset as a side effect of keep-alive/skip approach.
> `${number}` shows how many idles were issued during processing (_I was lucky to get no idles several times_)

# Suggestions and observations

1. Classic `class` syntax with `private`/`public` access modifiers
1. `process.on('unhandledRejection', ...)` + `try/catch`es
1. Rely on `Worker.Work()` method completion rather wait indefinitely 
1. `Database.ts:18` - use `this.get(key)` method to get data rather direct access
1. `main.ts:32` - `db.set` passed as a callback to worker looses its `this`, `db.set.bind(db)` or `m => db.set(m)` required to preserve scope (_fails consistently with regular class approach_)
1. Use env vars for `ITEMS_NUMBER` and `WORKERS_NUMBER`
1. Add logging (_+ proper log levels_) for signifcant operations (_enqueue, dequeue, confirmed, etc._)
1. `package.json` + `npm start` or `Makefile` or even `docker-compose.yml` for easier `npx tsx main.ts`
1. ESLint and/or Prettier config, but at least `.editorconfig`
1. _2 spaces_ indentation instead of 4
1. Commit `7f49583` has invalid conventional commit type `reat`