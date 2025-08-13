import customtkinter as ctk
import os, sys

WIDTH = 600
HEIGHT = 250

def resource_path(filename):
    # when frozen, files are in sys._MEIPASS; otherwise, next to script
    if getattr(sys, 'frozen', False):
        return os.path.join(sys._MEIPASS, filename)
    return os.path.join(os.path.dirname(__file__), filename)

class UpdaterUi(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.progress_var = ctk.DoubleVar(value=0.0)
        self.setup()

    def setup(self):
        self.geometry(f"{WIDTH}x{HEIGHT}")
        self.resizable(False, False)
        self.title("GravityBlu Updater")
        # self.iconbitmap("updater.ico")
        self.ui_content_setup()

    def ui_content_setup(self):
        # — Make the top (row 0) grow to push the content to the vertical center
        self.grid_rowconfigure(0, weight=1)
        # — Row 1 is your controls (fixed size)
        self.grid_rowconfigure(1, weight=0)
        # — Row 2 grows to fill the bottom space
        self.grid_rowconfigure(2, weight=1)

        # — Make both columns expand equally
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # 1) Logo spans both columns, so it's dead-center in row 0
        # updater_img = ctk.CTkImage(Image.open(resource_path("icon.png")), size=(250, 250))
        # image_label = ctk.CTkLabel(self, image=updater_img, text="")
        # image_label.grid(row=0, column=0, columnspan=2)

        # 2) Progress bar + percent in row 1
        self.progress_var = ctk.DoubleVar(value=0.0)
        bar = ctk.CTkProgressBar(
            self,
            width=300,
            progress_color="#432dd7",
            variable=self.progress_var
        )
        # bar in column 0, hug its east side
        bar.grid(row=1, column=0, sticky="e", padx=(0, 10), pady=30)

        self.progress_percent = ctk.CTkLabel(
            self,
            text="0%",
            font=("sans", 14, "bold"),
            text_color="green"
        )
        # percent in column 1, hug its west side
        self.progress_percent.grid(row=1, column=1, sticky="w", padx=(10, 0), pady=10)


# ui = UpdaterUi()
# ui.mainloop()
