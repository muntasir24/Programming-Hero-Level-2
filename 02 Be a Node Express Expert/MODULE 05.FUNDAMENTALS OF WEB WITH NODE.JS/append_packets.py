import os
import re

path = 'MODULE 05.FUNDAMENTALS OF WEB WITH NODE.JS/01.How Web Works.md'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix duplicates from the previous bad EOF insertions
# There are two duplicate Step 5s. We should clean it up using regex.
text = re.sub(r'(---\n\n## Step 5.*?)(?=---\n\n## Step 6)', '', text, flags=re.DOTALL)
# Wait, if I do this loosely, I might delete both. 
# Let me just rewrite the file fully to make sure it's 100% clean and includes "more details" plus Step 8.
