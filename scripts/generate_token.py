import sys
import asyncio
import hcskr
import json

async def main():
  global result
  result = await hcskr.asyncGenerateToken(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6]) #리턴값 참고하세요

asyncio.get_event_loop().run_until_complete(main())

print(json.dumps(result))
sys.stdout.flush()
