import $ from "../utils/prompt.ts";
import { type MultiSelectOption } from "@david/dax";
import { shells } from "../constants.ts";
import { Logger } from "../utils/logger.ts";
import { getCurrentShell } from "../utils/shell.ts";

import { isWritten } from "../utils/shell.ts";

const logPrefix = "install mise"
const logger = new Logger(logPrefix)

const getTargetShellCandidates = (curerntShell: string): MultiSelectOption[] => {
    return shells.map((s) => { return { text: s, selected: s === curerntShell } })
}

const getTargetShells = async (): Promise<string[]> => {
    const curerntShell = await getCurrentShell()
    const targetShellCandidates = getTargetShellCandidates(curerntShell)
    const targetShellsIdx = await $.multiSelect({
        message: `In which shells to activate mise. (current shell "${curerntShell}" is selected by default.)`,
        options: targetShellCandidates,
        noClear: true
    })
    const targetShells = targetShellCandidates.filter((_, idx) => targetShellsIdx.includes(idx)).map((s) => s.text)
    logger.info(`Following shells are selected: ${targetShells}`)
    return targetShells
}

const getActivationTargetFileAndKeyword = (shell: string): [string, string] => {
    let file = ""
    let keyword = ""
    const homeDir = Deno.env.get("HOME")
    switch (shell) {
        case "bash":
            // ~ だと何故か path.exists() が動作しないので絶対パスで置き換える
            file = `${homeDir}/.bashrc`
            keyword = `eval "$(~/.local/bin/mise activate bash)"`
            break
        case "zsh":
            file = `${homeDir}/.zshrc`
            keyword = `eval "$(~/.local/bin/mise activate zsh)"`
            break
        case "fish":
            file = `${homeDir}/.config/fish/config.fish`
            keyword = `~/.local/bin/mise activate fish | source`
    }
    return [file, keyword]
}

const activateMise = async () => {
    const targetShells = await getTargetShells()
    for (const shell of targetShells) {
        const [file, keyword] = getActivationTargetFileAndKeyword(shell)
        logger.info(`check if activation keyword (${keyword}) is already written in file (${file})`)
        // 後続の noThrow で全てのエラーが無視されるので、ファイルの有無は事前に確認しておく
        const isExists = await $.path(file).exists()
        logger.info(`${$.path(file)}: ${isExists}`)
        if (!isExists) {
            logger.warning(`activation in shell ${shell} is skipped since target file ${file} is not exists.`)
            continue
        }
        const _isWritten = await isWritten(file, keyword)
        if (_isWritten) {
            logger.info(`activation keyword ${keyword} is already written in file ${file}.`)
            continue
        }
        logger.info(`write activation keyword "${keyword}" to file ${file}.`)
        await $`echo ${keyword} >> ${$.path(file)}`
        logger.info(`activation keyword is added to file ${file}.`)
    }
}

export const installMise = async () => {
    logger.info("Staring to install mise.")
    await $`curl https://mise.run | sh`
    logger.info("Mise is installed.")
    logger.info("Modify .*rc file to activate mise.")
    await activateMise()
    logger.info("Mise is activated.")
}