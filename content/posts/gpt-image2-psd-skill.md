---
title: 我把GPT-image-2生成PSD的能力打包成了Skill，免费开源
date: 2026-07-02
tags: [转载, AI]
excerpt: 用 GPT-image-2 + Codex 把 AI 生成的图片拆成可编辑图层、打包成 PSD 文件，开源成一个 Skill——图层从网页端的 7 层做到 12 层无残影。
---

> 转载收藏 · 原文来自 X [@bggg_ai](https://x.com/bggg_ai/status/2072563993290653992)

![图像](https://pbs.twimg.com/media/HMM5T7BbkAAoGbu?format=jpg&name=large)

现在GPT-image-2 的生图能力非常牛逼，但改图依然是AI的痛。

所以像Lovart这样的设计Agent，就出了能直接对AI生成图片编辑的功能

![图像](https://pbs.twimg.com/media/HMM5H2IawAA4vCQ?format=jpg&name=large)

![图像](https://pbs.twimg.com/media/HMM5IymbUAAxZNo?format=jpg&name=large)

但，我发现，ChatGPT也可以直接完成这件事了。

基本上一句话就能从Image2的图转成多个图层、可以编辑的PSD文件。

但在网页端的体验还是无法落地成生产力。

之前分享过Codex配合Image2的工作流，于是，经过我一顿操作

成功开发了一个可以在Codex里生成Image后再转成PSD的skill

这才是生产力啊！！开源地址在文末。

接下来分享一下过程。

![图像](https://pbs.twimg.com/media/HMM5JgabwAAsXZo?format=jpg&name=large)

01

ChatGPT 网页端：连上 Photoshop，把合并图拆成图层

ChatGPT，先在设置里打开连接点，把 Photoshop应用链接进来。

![图像](https://pbs.twimg.com/media/HMM5KUdaQAEJ9EQ?format=jpg&name=large)

ChatGPT 连接 Photoshop 设置入口

![图像](https://pbs.twimg.com/media/HMM5KzqbIAAZco5?format=jpg&name=large)

连接完成界面

![图像](https://pbs.twimg.com/media/HMM5Lgbb0AAzKKp?format=jpg&name=large)

点连接，让 ChatGPT 和 Photoshop 建立通道

然后，新开聊天框生图。

刚好我们下个月6月8日在厦门有场 AI 跨境电商线下大会，需要一张海报。正好让 GPT-image-2 生成了一张。

![图像](https://pbs.twimg.com/media/HMM5MJtaYAAvUpM?format=jpg&name=large)

用 GPT-image-2 生成的厦门大会海报

这时候海报是一张合并图。要改文字或者换底色，直接改不了。

换个思路：先让 GPT 把海报拆成若干张独立图像，底色白色，每张对应 PSD 里的一个图层，再拼成 PSD 文件。

**第一步：拆图层**

直接用这段提示词：

接下来，我要把这张图改成 PSD 导入 Photoshop 做编辑， 所以需要你先把生成的这张海报拆成若干个图像， 不要改变相对位置，底色为白色。

**第二步：选中 Photoshop 应用，生成 PSD**

在应用选择里点开 Photoshop。

![图像](https://pbs.twimg.com/media/HMM5M6zakAENsji?format=jpg&name=large)

在 ChatGPT 里选中 Photoshop 应用

然后让 ChatGPT 把拆好的图拼成 PSD：

根据以上拆分的图像拼成 PSD 文件，每个图像对应一个图层， 注意有些是图像，有些是文字。去除白色底。给我 PSD 文件。

跑完能拿到一个 PSD 文件。

![图像](https://pbs.twimg.com/media/HMM5NixboAAIpyH?format=png&name=large)

ChatGPT 输出的 PSD 文件

导入 Photoshop，看到图层了。

![图像](https://pbs.twimg.com/media/HMM5OAhbYAAaIp-?format=jpg&name=large)

导入 PS 后的图层状态

![图像](https://pbs.twimg.com/media/HMM5OlyaQAAaiXl?format=png&name=large)

动图看图层效果

这次拆出来 7 层。

能用，但问题也很明显：标题下面有残影，文字和背景图合在了同一层里没有分开。图比较复杂的话，7 层是网页端的上限。

02

翻了一下对话记录，发现背后是 Python 包在跑

为了搞清楚网页端的极限在哪，我偷瞄了一下 ChatGPT的思考过程。

发现它背后调用的是 Python 的 psd-tools 包。

![图像](https://pbs.twimg.com/media/HMM5PhbbgAAZk1c?format=jpg&name=large)

ChatGPT 背后调用的 Python 实现

也就是说，流程是：生图 → 用 Python 处理图像拆分 → 拼成 PSD。

说白了就是，图层拆得细不细，取决于 Python 脚本怎么写。而网页端是一次性生成，生完就结束，不会回头检查「这个图层拆得对不对」。

然后我想到了 Codex。

Codex 有 reasoning loop——它在跑任务的过程中会检查自己的中间结果，发现问题了会回去修。这个特性用在图像拆分上，理论上能拆出更多图层，质量也更可控。

所以，我尝试把这套流程开发成 Skill。

03

用 Codex 开发 bggg-creator-image2psd Skill：12 层，无残影

打开 Codex，给了一段需求描述，加上网上找到的两个开源项目作参考。

![图像](https://pbs.twimg.com/media/HMM5QFtasAApXag?format=jpg&name=large)

给 Codex 的需求描述与参考项目

一顿操作就开发好了 bggg-creator-image2psd Skill，然后用同样的厦门大会海报测试。

结果出来了。

12 层。

![图像](https://pbs.twimg.com/media/HMM5Qmka0AInM7H?format=jpg&name=large)

Codex 处理结果：12 个图层

导入 Photoshop。

![图像](https://pbs.twimg.com/media/HMM5RICbQAA3yhC?format=jpg&name=large)

Codex 结果导入 PS

![图像](https://pbs.twimg.com/media/HMM5RuzboAAEnmB?format=png&name=large)

动图对比效果

标题下面那块残影消失了。文字单独成层，背景、图形元素各自分开。

Codex 在跑任务的过程中，发现拆出的图层有边缘污点，会自动回去调整 Python 脚本的参数，重新处理，直到结果干净为止。这是 reasoning loop 在实际工作中的效果。

![图像](https://pbs.twimg.com/media/HMM5Sgrb0AA6JOy?format=jpg&name=large)

Codex 思考过程中自检修正

同一套 Skill，拿跨境电商的素材图也测了一遍，同样能拆。

![图像](https://pbs.twimg.com/media/HMM5S-qbsAAbmV7?format=jpg&name=large)

跨境电商图片拆层结果

04

Skill开源地址

[https://github.com/binggandata/bggg-skills/tree/main/bggg-creator-image2psd](https://github.com/binggandata/bggg-skills/tree/main/bggg-creator-image2psd)

包括之前开源的饕餮.skill，以及后续的 Skill，都会同步到这个仓库：

[https://github.com/binggandata/bggg-skills](https://github.com/binggandata/bggg-skills)

求stars支持

不过有一说一，这个效果还不是很完美，如果有更好的想法欢迎提议！！