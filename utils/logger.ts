import $ from "@david/dax";
import type { $Type } from "@david/dax";

export class Logger {
    #$: $Type
    prefix: string

    constructor(prefix: string) {
        this.#$ = $
        this.prefix = prefix
    }

    debug(msg: string) {
        this.#$.logLight(`[DEBUG] [${this.prefix}] ${msg}`)
    }

    info(msg: string) {
        this.#$.log(`[INFO] [${this.prefix}] ${msg}`)
    }

    warning(msg: string) {
        this.#$.logWarn(`[WARNING] [${this.prefix}] ${msg}`)
    }

    error(msg: string) {
        this.#$.logError(`[ERROR] [${this.prefix}] ${msg}`)
    }
}