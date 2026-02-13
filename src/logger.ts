import chalk from 'chalk';

export const logger = {
    info: (msg: string) => console.log(chalk.blue('ℹ ') + msg),
    success: (msg: string) => console.log(chalk.green('✓ ') + msg),
    error: (msg: string) => console.error(chalk.red('✗ ') + msg),
    weather: (msg: string) => console.log(chalk.yellow('☀ ') + msg),
    news: (msg: string) => console.log(chalk.magenta('📰 ') + msg),
    header: (msg: string) => console.log('\n' + chalk.bold.cyan(`=== ${msg} ===`)),
    divider: () => console.log(chalk.gray('----------------------------------------')),
};
