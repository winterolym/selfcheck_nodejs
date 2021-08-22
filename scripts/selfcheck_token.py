import asyncio
import hcskr
import json
import sys


async def main():
  global result
  result = await hcskr.asyncTokenSelfCheck(sys.argv[1])
asyncio.get_event_loop().run_until_complete(main())

f = open("logs", "w")
f.write(json.dumps(result))
f.write("\n")
f.close()

print(json.dumps(result))
sys.stdout.flush()
