import pathlib


ROOT_PATH = pathlib.Path(__file__).parent.parent.parent
DENO_PATH = ROOT_PATH / "deno_runtime" / "deno.exe"


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



