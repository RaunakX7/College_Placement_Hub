import os

startpath = r"d:\college-placement-internship-management-system-main_legacy\college-placement-internship-management-system-main_legacy"
ignore_dirs = {'.git', 'node_modules', '.next'}
output_lines = [
    "===================================================================",
    "                  PLACEHUB PORTAL - PROJECT TREE",
    "===================================================================\n"
]

def list_files(dir_path, indent=""):
    try:
        items = sorted(os.listdir(dir_path))
    except Exception:
        return
    for item in items:
        if item in ignore_dirs:
            continue
        path = os.path.join(dir_path, item)
        if os.path.isdir(path):
            output_lines.append(f"{indent}├── {item}/")
            list_files(path, indent + "│   ")
        else:
            output_lines.append(f"{indent}└── {item}")

list_files(startpath)
output_lines.append("\n===================================================================")

with open(os.path.join(startpath, "project_tree.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(output_lines))

print("Project tree generated successfully!")
