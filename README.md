Compile: cc main.c -I /usr/local/include -L /usr/lib/x86_64-linux-gnu/X11 -l X11 -lm -lstdc++ -ggdb

GDB:
gdb main
break line_number (or b)
run

print var (or p)
bt (for backtrace)
next (n)
step (s)
continue (c)

Can also print expressions (and functions, f.e. p foo(1))
call foo(1)

Debug included files:
(gdb) b box.h:42
Breakpoint 1 at 0x16b9: file box.h, line 43.


Links:
https://github.com/QMonkey/Xlib-demo/blob/master/src/simple-drawing.c     
https://github.com/QMonkey/Xlib-demo/blob/master/src/color-drawing.c     
