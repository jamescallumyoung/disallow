import {join} from 'node:path';
import {cwd, exit} from 'node:process';
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {isPackage, Package} from "./types/Package.js";
import {DisallowList, isDisallowList} from "./types/DisallowList.js";
import {readJsonFile} from "./readJsonFile.js";

(async function main() {

  const { argv } = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command('check', 'Check the package.json doesn\'t include any disallowed packages')
    // --package
    .alias('p', 'package')
    .nargs('p', 1)
    .describe('p', 'The package.json file to check. (UTF-8)')
    // --list
    .alias('l', 'list')
    .nargs('l', 1)
    .describe('l', 'The disallow list to use. (UTF-8)')
    // --json
    .alias('j', 'json')
    .boolean('j')
    .default('j', false)
    .describe('j', 'Print output as JSON?')
    .demandOption(['p', 'l'])
    .help('h')
    .alias('h', 'help');

  const { p: packageArg, l: listArg, j: printAsJson } = await argv;


  // yargs automatically validates the --package/-p and --list/-l args are provided, we just validate their types.
  if (typeof packageArg !== 'string') {
    console.log(`Bad argument for --package: "${packageArg}"`);
    exit(100);
  }
  if (typeof listArg !== 'string') {
    console.log(`Bad argument for --list: "${listArg}"`);
    exit(101);
  }


  // process package.json
  let pkg: Package;
  try {
    const packageJson = await readJsonFile(join(/*cwd(), */packageArg));

    if (!isPackage(packageJson)) {
      console.error('Supplied package.json is not valid.');
      exit(210);
    }
    pkg = packageJson;
  }
  catch (err) {
    exit(211);
  }


  // process disallow list
  let list: DisallowList;
  try {
    const listJson = await readJsonFile(join(/*cwd(), */listArg));

    if (!isDisallowList(listJson)) {
      console.error('Supplied disallow list is not valid.');
      exit(220);
    }
    list = listJson;
  }
  catch (err) {
    exit(221);
  }


  // find disallowed packages
  const foundDisallowed: string[] = [
    ... new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ]),
  ]
    .filter(dep => list.disallow.includes(dep));

  // print results as JSON
  if (printAsJson) {
    console.error(JSON.stringify({ found: foundDisallowed }));
    exit((foundDisallowed.length !== 0) ? 300 : 0);
  }

  // print results as text
  if (foundDisallowed.length !== 0) {
    console.error('Found disallowed dependencies in package.json:');
    foundDisallowed.forEach(dep => console.error(`-> ${dep}`));
    exit(300);
  }
  console.log('No disallowed dependencies found.');
  exit(0);

})();
