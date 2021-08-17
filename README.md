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


https://github.com/DanZaidan/pong_learn_programming/blob/master/My_First_Cpp_Game/win32_platform.cpp#L142     
https://github.com/DanZaidan/pong_learn_programming/blob/master/My_First_Cpp_Game/game.cpp#L16     
https://www.youtube.com/watch?v=gFBToWRjDZ4&list=PL7Ej6SUky135IAAR3PFCFyiVwanauRqj3&index=6     


https://github.com/HandmadeHero/linux/blob/1e5ef3caed26520cf3b008cb9a8946c7e158e6c9/code/linux_handmade.cpp#L2433     
https://github.com/HandmadeHero/linux/blob/1e5ef3caed26520cf3b008cb9a8946c7e158e6c9/code/linux_handmade.cpp#L2218     
