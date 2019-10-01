export function paddedPrint(message: string) {
  console.log(`\n${message}\n`);
}

export async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
