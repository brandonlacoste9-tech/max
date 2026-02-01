import sys
import os

# Add the UI Pro Max skill paths to sys.path
skill_root = r"c:\Users\north\max\ui-ux-pro-max-skill\src\ui-ux-pro-max"
sys.path.append(os.path.join(skill_root, "scripts"))

from design_system import generate_design_system

# Define the vision
query = "Voyageur Luxury - Imperial Québécois AI Platform. Red #8B0000, Gold #C9A34F, White #F8F2E8. Gladiator mode, 3D Fleur-de-lys, premium textures."

# Generate the design system
print("Generating Imperial Design System...")
output = generate_design_system(
    query=query,
    project_name="Voyageur Luxury",
    output_format="markdown",
    persist=True,
    output_dir=r"c:\Users\north\max"
)

print("\n--- DESIGN SYSTEM GENERATED ---")
print(output)
