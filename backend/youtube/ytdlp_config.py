import pathlib
import sys


def get_deno_path():
    if getattr(sys, "frozen", False):
        base_path = pathlib.Path(sys.executable).parent
    else:
        base_path = pathlib.Path(__file__).parent.parent.parent

    return base_path / "deno_runtime" / "deno.exe"

DENO_PATH = get_deno_path()

DEFAULT_OPTS = {
    "noprogress": True,
    "quiet": True,
    "no_warnings": True,
    "no_color": True,
    "forcejson": True,
    "noplaylist": True,

    "js_runtimes": {
        "deno": {
            "args": [DENO_PATH]
        }
    }
}

def get_opts(overrides=None):
    opts = DEFAULT_OPTS.copy()
    if overrides:
        opts.update(overrides)
    return opts



