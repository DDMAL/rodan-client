import os
import argparse

# HEADER_TEMPLATE_DIRECTORY = "templates/"
# BACKBONE_TEMPLATE_DIRECTORY = "templates/underscore-templates/"


def format_underscore_template(name, content):
    """
    Format the template as an Underscore.js template.
    """
    return '\n<script type="text/template" id="{0}">\n{1}\n</script>\n'.format(name, content)


def assemble_templates(base_template_file, template_dir):
    """
    Assemble the header, the footer, and all backbone templates into one string.
    """
    # Grab the header content
    output = open(base_template_file).read()

    # Attach the backbone templates
    templates = ""
    for directory, subdir, files in os.walk(template_dir):
        for f in files:
            if f.endswith(".html"):
                name = f.rstrip(".html")
                content = open(os.path.join(directory, f), "r").read()
                # It is a template, so add it
                templates += format_underscore_template(name, content)
    return output.format(templates=templates)


def build_underscore_templates(base_template, template_dir, build_dir, output_name):
    # Open the file to build
    if not os.path.exists(build_dir):
        os.mkdir(build_dir)

    output_file = open(os.path.join(build_dir, output_name), "w+")
    # Get and write it's content
    output_file.write(assemble_templates(base_template, template_dir))
    output_file.close()

# Execute
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Backbone Templates")
    parser.add_argument('builddir', help="Build output directory")
    parser.add_argument('-b', '--base', required=True, help="Path to the base template file")
    parser.add_argument('-t', '--templates', required=True, help="Path to the template directory")
    parser.add_argument('-f', '--filename', default="index.html", help="Output filename (defaults to index.html)")
    args = parser.parse_args()

    build_underscore_templates(args.base, args.templates, args.builddir, args.filename)
    print("Templates built successfully!")
