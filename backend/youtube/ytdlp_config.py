import pathlib
import os

ROOT_PATH = pathlib.Path(__file__).parent.parent.parent
# DENO_PATH = ROOT_PATH / "deno_runtime" / "deno.exe"
DENO_PATH = os.path.join(ROOT_PATH, "deno_runtime", "deno.exe")


DEFAULT_OPTS = {
    "noprogress": True,
    "quiet": True,
    "no_warnings": True,
    "no_color": True,
    "forcejson": True,
    "noplaylist": True,

    "js_runtimes": {
        "deno": {"path": DENO_PATH}
    }
}

DEBUG_OPTS = {
    "noprogress": False,
    "quiet": False,
    "no_warnings": False,
    "no_color": False,
    "forcejson": True,
    "versbose": True,
}

def get_opts(overrides=None):
    opts = DEFAULT_OPTS.copy()
    if overrides:
        opts.update(overrides)
    return opts


from backend.utils.utils import get_ffmpeg_path, generate_filename
from backend.user.database import get_user

def general_video_ydlopts(video_info, extra_args=None, downloading_segments=False):
    """
        Minimalistic, contains default things like save location, ffmpeg location, filename to save to
        Rest all like format and other required details to be added by the caller using the extra_args
    """
    ffmpeg_path = get_ffmpeg_path()
    user = get_user()
    save_location = user.user_save_location

    video_title = video_info.get("videoTitle")
    filename = generate_filename(video_title)

    ydl_opts = get_opts({
        "ffmpeg_location": ffmpeg_path,
        "outtmpl": f"{save_location}/{filename}_%(section_start)s-%(section_end)s" if downloading_segments else f"{save_location}/{filename}",
        "updatetime": False,
        "merge_output_format": "mp4",
    })

    if extra_args:
        ydl_opts.update(extra_args)

    return ydl_opts



