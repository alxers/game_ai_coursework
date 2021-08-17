// cc main.c -I /usr/local/include -L /usr/lib/x86_64-linux-gnu/X11 -l X11 -lm -lstdc++ -ggdb

#define Q_KEY 0x18
#define W_KEY 0x19
#define A_KEY 0x26
#define S_KEY 0x27
#define D_KEY 0x28

#define M_PI 3.1415926535

#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <x86intrin.h>
#include "shapes.c"

// Make mapping so that it's possible to use RGB in Xlib
unsigned long _rgb(int r, int g, int b) {
    return b + (g << 8) + (r << 16);
}

int w_width = 800; // 400
int w_height = 600; // 200
// int MonitorRefreshHz = 60;
// float GameUpdateHz = (float)(MonitorRefreshHz);
float GameUpdateHz = 60.0;

struct timespec tp;
clockid_t clk_id;

//  clk_id = CLOCK_REALTIME;
clk_id = CLOCK_MONOTONIC;
//  clk_id = CLOCK_BOOTTIME;
//  clk_id = CLOCK_PROCESS_CPUTIME_ID;

// Xlib variables
Display *disp;
Window win;
int screen;
// End Xlib variables

void drawRect() {
    // XDrawRectangle(display, d, gc, x, y, width, height)
    //       Display *display;
    //       Drawable d;
    //       GC gc;
    //       int x, y;
    //       unsigned int width, height;
    XDrawRectangle(disp, win, DefaultGC(disp, screen), 10, 20, 100, 200);
}

void drawCircle() {
    // XDrawArc(display, d, gc, x, y, width, height, angle1, angle2)
    //   Display *display;
    //   Drawable d;
    //   GC gc;
    //   int x, y;
    //   unsigned int width, height;
    //   int angle1, angle2;

    // Diameter is 30 pixels, center at location (50, 100)
    // XSetForeground(disp, DefaultGC(disp, screen), green.pixel);
    // XDrawArc(disp, win, DefaultGC(disp, screen), 50-(30/2), 100-(30/2), 30, 30, 0, 360*64);
    // XSetForeground(disp, DefaultGC(disp, screen), _rgb(255, 255, 255));

    XSetForeground(disp, DefaultGC(disp, screen), _rgb(0, 255, 0));
    XFillArc(disp, win, DefaultGC(disp, screen), 50-(30/2), 100-(30/2), 30, 30, 0, 360*64);
}

struct timespec
LinuxGetWallClock()
{
    struct timespec Clock;
    clock_gettime(CLOCK_MONOTONIC, &Clock);
    return Clock;
}

float
LinuxGetSecondsElapsed(struct timespec Start, struct timespec End)
{
    return ((float)(End.tv_sec - Start.tv_sec)
            + ((float)(End.tv_nsec - Start.tv_nsec) * 1e-9f));
}

int
RoundReal32ToInt32(float Real32)
{
    int Result = _mm_cvtss_si32(_mm_set_ss(Real32));
    return(Result);
}


int main(void) {
    // X window setup
    XEvent event;

    disp = XOpenDisplay(NULL);
        if (disp == NULL) {
        fprintf(stderr, "Cannot open display\n");
        exit(1);
    }

    screen = DefaultScreen(disp);
    win = XCreateSimpleWindow(disp, RootWindow(disp, screen), 0, 0, w_width, w_height, 0,
                              BlackPixel(disp, screen), WhitePixel(disp, screen)
                              );
    XSelectInput(disp, win, ExposureMask | KeyPressMask);
    XMapWindow(disp, win);

    XEvent evt;
    evt.type = Expose;
    evt.xexpose.type = Expose;
    evt.xexpose.serial = 0;
    evt.xexpose.send_event = 1;
    evt.xexpose.window = win;
    evt.xexpose.x = 0;
    evt.xexpose.y = 0;
    evt.xexpose.width = 400;
    evt.xexpose.height = 400;
    evt.xexpose.count = 0;
    // end X window setup

    // Timer
    float deltaTime = 0.016666f;
    struct timespec LastCounter = LinuxGetWallClock();
    struct timespec FlipWallClock = LinuxGetWallClock();
    uint ExpectedFramesPerUpdate = 1;
    float TargetSecondsPerFrame = (float)ExpectedFramesPerUpdate / (float)GameUpdateHz;
    // end Timer


    while (1) {
        // XClearWindow(disp, win);
        struct timespec WorkCounter = LinuxGetWallClock();
        float WorkSecondsElapsed = LinuxGetSecondsElapsed(LastCounter, WorkCounter);
        
        float SecondsElapsedForFrame = WorkSecondsElapsed;
        if (SecondsElapsedForFrame < TargetSecondsPerFrame)
        {
            uint SleepUs = (uint)(0.99e6f * (TargetSecondsPerFrame - SecondsElapsedForFrame));
            usleep(SleepUs);
            while (SecondsElapsedForFrame < TargetSecondsPerFrame)
            {
                SecondsElapsedForFrame = LinuxGetSecondsElapsed(LastCounter, LinuxGetWallClock());
            }
        }
        else
        {
            // Missed frame rate
        }

        // drawRect();
        // if (randTime > 0) {
        //     drawCircle();
        //     printf("%d\n", randTime);
        //     // XClearWindow(disp, win);
        // }

        XNextEvent(disp, &event);
        if (event.type == Expose) {
            drawCircle();

            drawRect();

            // Send "Expose" event again in order to redraw
            XSendEvent(disp, win, 0, ExposureMask, &evt);
        }

        FlipWallClock = LinuxGetWallClock();
        struct timespec EndCounter = LinuxGetWallClock();
        float MeasuredSecondsPerFrame = LinuxGetSecondsElapsed(LastCounter, EndCounter);
        float ExactTargetFramesPerUpdate = MeasuredSecondsPerFrame*GameUpdateHz;

        // Not sure they are needed
        // uint NewExpectedFramesPerUpdate = RoundReal32ToInt32(ExactTargetFramesPerUpdate);
        // ExpectedFramesPerUpdate = NewExpectedFramesPerUpdate;
        //

        TargetSecondsPerFrame = MeasuredSecondsPerFrame;
        LastCounter = EndCounter;
    }

    XCloseDisplay(disp);
    return 0;
}
