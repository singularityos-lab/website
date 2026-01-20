# Singularity OS + Singularity Desktop
sinty.dev is the home of **Singularity OS**, a new operating system built on top of Vanilla OS. Please note that what you currently see on GitHub is **NOT** the final product. I have preferred to work locally over the past few months, while this has dramatically accelerated development, it has also resulted in code that requires major revisions before it can be published. Give me some time, and I will be pushing many commits soon. In the meantime, follow me on Twitter and Mastodon for updates. Oh, and here are some videos and/or screenshots:

<table>
  <tr>
    <td>
      <blockquote class="twitter-tweet"><p lang="en" dir="ltr">It&#39;s not GNOME, it&#39;s not KDE, it&#39;s not the new Vanilla OS DE, it&#39;s new, uses &lt;100M of memory, is accessible (for real) and uses GTK4 (but not libadwaita).<br><br>In case the video got ultra-compressed by X, see it in my Mastodon./social account.<a href="https://twitter.com/hashtag/Linux?src=hash&amp;ref_src=twsrc%5Etfw">#Linux</a> <a href="https://twitter.com/hashtag/Windows?src=hash&amp;ref_src=twsrc%5Etfw">#Windows</a> <a href="https://twitter.com/hashtag/OpenSource?src=hash&amp;ref_src=twsrc%5Etfw">#OpenSource</a> <a href="https://twitter.com/hashtag/FOSS?src=hash&amp;ref_src=twsrc%5Etfw">#FOSS</a> <a href="https://t.co/wxrYFNAwRo">pic.twitter.com/wxrYFNAwRo</a></p>&mdash; Mirko Brombin (@brombinmirko) <a href="https://twitter.com/brombinmirko/status/2013294217372570092?ref_src=twsrc%5Etfw">January 19, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </td>
    <td>
      <blockquote class="mastodon-embed" data-embed-url="https://mastodon.social/@mirkobrombin/115923069305187855/embed" style="background: #FCF8FF; border-radius: 8px; border: 1px solid #C9C4DA; margin: 0; max-width: 540px; min-width: 270px; overflow: hidden; padding: 0;"> <a href="https://mastodon.social/@mirkobrombin/115923069305187855" target="_blank" style="align-items: center; color: #1C1A25; display: flex; flex-direction: column; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Roboto, sans-serif; font-size: 14px; justify-content: center; letter-spacing: 0.25px; line-height: 20px; padding: 24px; text-decoration: none;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 79 75"><path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"/></svg> <div style="color: #787588; margin-top: 16px;">Post by @mirkobrombin@mastodon.social</div> <div style="font-weight: 500;">View on Mastodon</div> </a> </blockquote> <script data-allowed-prefixes="https://mastodon.social/" async src="https://mastodon.social/embed.js"></script>
    </td>
  </tr>
</table>

## Where can I read more?
I will post any updates on my [Twitter](https://x.com/brombinmirko) and [Mastodon](https://mastodon.social/@mirkobrombin) accounts. Oh and the code will be pushed soon on the dedicated [GitHub](https://github.com/singularityos-lab) org.

## FAQ

#### Why does the DE look so much like GNOME?
Because I like its workflow and parts of its UI. However, this is going to change. It was simply easier not to worry about the UI yet and focus on the foundations instead. Of course, features like the sidebar, topbar, dock, and the 'fusion mode' (which merges the topbar and dock) will stay.

#### Why GTK?
Because I am used to it.

#### Why Vala?
I am looking for performance. I am learning Rust, but I'm not quite ready to use it for a project as complex as this. It works fine for [Bottles Next](https://usebottles.com/posts/2024-12-27-rust-libcosmic-next/) though! :D

#### Xorg?
No.

#### So... Wayland?
Absolutely, from Day ZERO.

#### Blur?
Coming soon, but absolutely yes.

#### Oh no, another GTK4 DE... wait, is it not Adwaita?
Yup, no libadwaita at all, just pure GTK4 and a custom set of widgets to keep everything integrated, named `libsingularity`.

#### Why that name, Singularity?
Because... well... it was just cool, ok? Pff.

#### Is this project real or just a meme?
I used to joke about making a desktop environment, but... nah, this time it is real.

#### Are you leaving Vanilla OS?
Ooof no, absolutely not. Actually, I am working on a full rewrite of all Vanilla OS tools using the new [Vanilla OS SDK](https://github.com/Vanilla-OS/sdk) I created. Orchid is also the base of Singularity OS; I will just be using a different immutability approach instead of ABRoot. I am experimenting with something new, maybe not for Day Zero, but... yeah. I'll take all the good parts from Vanilla while continuing to work on it. =)

---

Oh and I also have a website but I will probably not publish there soon... anyway: [bromb.in](https://bromb.in).
