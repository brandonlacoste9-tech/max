#!/bin/bash
# Ralph Wiggum Loop - MAX Edition
# Keeps running until <promise>COMPLETE</promise> or max iterations

ITERATIONS=${1:-10}
MAX_TOKENS=${2:-100000}
SESSION_LABEL="ralph-$$"

echo "🐝 RALPH WIGGUM MODE ENGAGED"
echo "================================"
echo "Iterations: $ITERATIONS"
echo "Max tokens: $MAX_TOKENS"
echo ""

for ((i=1; i<=ITERATIONS; i++)); do
    echo "🐝 Iteration $i/$ITERATIONS"
    echo "---"
    
    # Run the agent task - output COMPLETE when done
    TASK="Implement and test the sovereign-bridge-sync.ts
    1. Run: bun run test (or npm test)
    2. If tests pass and sync works, output exactly: <promise>COMPLETE</promise>
    3. If tests fail, fix and retry"
    
    # Using sessions_spawn to run in isolated session
    openclaw sessions spawn \
        --label "$SESSION_LABEL-$i" \
        --run-timeout 300 \
        --task "$TASK"
    
    # Check result
    if [[ "$OUTPUT" == *"<promise>COMPLETE</promise>"* ]]; then
        echo ""
        echo "✅ MISSION COMPLETE - The Hive is secure!"
        exit 0
    fi
    
    echo "❌ Criteria not met. Sleeping 5s then retrying..."
    sleep 5
done

echo ""
echo "💀 MAX ITERATIONS REACHED - Mission failed"
exit 1
