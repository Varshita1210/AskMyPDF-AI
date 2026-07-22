import os
import glob

search_dirs = [
    r"C:\Users\Varshita\Downloads",
    r"C:\Users\Varshita\OneDrive\Documents",
    r"C:\Users\Varshita\Desktop"
]

print("Searching for PDF:")
found = []
for d in search_dirs:
    if os.path.exists(d):
        pattern = os.path.join(d, "**", "*ET_AI_Hackathon_2026_Problem_Statements*.pdf")
        matches = glob.glob(pattern, recursive=True)
        for m in matches:
            print(f"- Found: {m}")
            found.append(m)
            
if not found:
    print("No matches found in common directories.")
