---
layout: post
title: I migrated laptops and everything broke.
date: 2018-11-21 18:44 -0800
category: tech
---
A few weeks ago, my laptop's screen gave out. I switched to a new laptop, and
used Apple's handy-dandy [migration
assistant](https://support.apple.com/en-us/HT204350), which worked well for
everything **except my development environment**.

The first sign of trouble was when I tried to run `bundle` and got
```
/usr/local/bin/bundle: /usr/local/opt/ruby/bin/ruby: bad interpreter: No such
file or directory 
```

...what? I tried reinstalling Homebrew's ruby, which didn't work.

When I ran `brew upgrade`, many packages could not be built because it could not
find dependencies in `/usr/local/opt` (double what?).
I started individually re-installing packages (via `brew unlink` and `brew
link`, but realized that most of the errors laid in a bunch of files in
`/usr/local/share`. Luckily, anything in `usr/local` is [not critical to the
OS](https://docs.brew.sh/FAQ), so you can remove files (at the risk of
reinstalling missing dependencies, which I was
doing anyways).

I ended up doing this to fix my troubles:

- Empty `/usr/local/share`
- Run `brew update && brew upgrade`
- Run `brew list | xargs brew reinstall`
- For good measure, run `brew doctor` and fix what it complains about.
- I also started using [rbenv](https://github.com/rbenv/rbenv). Even though I
    never use ruby, it's nice (I can run `jekyll` without prepending `bundle`!)
