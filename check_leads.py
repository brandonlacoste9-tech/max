import lancedb
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("LANCEDB_API_KEY")

try:
    db = lancedb.connect(uri="db://max-ulb1x0", api_key=api_key, region="us-east-1")
    tbl = db.open_table("my_table3")
    print(f"Total rows: {len(tbl)}")
    # Print the last 5 items (if any, though LanceDB might not be sorted)
    # Actually just print some to verify they are real leads
    df = tbl.to_pandas().tail(5)
    print(df[["item", "price"]])
except Exception as e:
    print(f"❌ Failed: {e}")
