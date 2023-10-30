import click
import os
import fnmatch


@click.command()
@click.option("--service", help="Name of image", required=True)
@click.option(
    "--env", help="Environment to deploy to, i.e. stage, prod", required=True
)
@click.option("--registry", help="Name of the Docker registry", required=True)
@click.option(
    "--image_version", help="Name of the iamge version to deploy", required=True
)
def prep_k8s_file(service, env, registry, image_version):
    click.echo("Staging k8s deployment files")
    base_path = os.path.dirname(os.path.realpath(__file__))
    k8s_deployment_dir = os.path.join(base_path, "k8s", env)
    find_replace(k8s_deployment_dir, "%REGISTRY%", registry, "*.yaml")
    find_replace(k8s_deployment_dir, "%IMAGE_VERSION%", image_version, "*.yaml")


def find_replace(directory, find, replace, filePattern):
    for path, dirs, files in os.walk(os.path.abspath(directory)):
        for filename in fnmatch.filter(files, filePattern):
            filepath = os.path.join(path, filename)
            with open(filepath) as f:
                s = f.read()
            s = s.replace(find, replace)
            with open(filepath, "w") as f:
                f.write(s)


if __name__ == "__main__":
    prep_k8s_file()
