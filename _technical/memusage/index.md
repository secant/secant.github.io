---
layout: post
title: Installing memusage on Ubuntu
date: 2020-03-01
---
For some annoying reason, Ubuntu does not package `memusage` in their libc.

1. Download a version of [glibc](https://www.gnu.org/software/libc/sources.html)
   that's old enough to match your version of Ubuntu.
2. Compile and install into a destination that's *not* `/usr/local`, I used
    `PREFIX=~/glibc`. Weird compiler errors probably means you need to try an
    older version.
3. Add `$PREFIX/bin` to your `$PATH`. In `$PREFIX/bin/libmemusage` you might
   have to change the `memusageso=...` line to where `libmemusage.so` lives
   (`$PREFIX/lib/libmemusage.so`) for the script to run successfully.

Speaking from experience: keep this thing far, far away from `/usr` or
`/usr/local` or else you might brick your machine when you `ldconfig` and your
entire system links into this glibc.

Maybe the real solution is to use Debian :-).
