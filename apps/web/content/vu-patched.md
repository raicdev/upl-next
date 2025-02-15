---
title: "VistaUpdaterはパッチされました"
date: 2024-08-31T18:31:44+09:00
description: VistaUpdaterはMicrosoftによってパッチされたことをお知らせします。
tags: ["VistaUpdater"]
---

## この投稿について

VistaUpdaterはMicrosoftによってパッチされたことをお知らせします。

この投稿では、VistaUpdaterの未来とどうパッチされたのかについてを書いています。

## VistaUpdaterのパッチ

実は、2024年の5月~8月ごろにVistaUpdater(Vista_SHA2_WUC)はパッチされていました。理由は、暗号化のアルゴリズムがサポートされなくなったことが原因だとされています。(海外のフォーラムから)

VistaUpdaterのパッチというわけではなく、Vista_SHA2_WUCのパッチです。少し早めに気づいていたらよかったかもしれません。

これは、VistaUpdaterの仕組みを大きく変えることになります。Vista_SHA2_WUCの方法は使えなくなったので、別の仕組みに変える必要があります。

## VistaUpdaterの未来

VistaUpdaterは、この先**WSUS Proxy(WSUS_Proxy_NT6)**を使うことになります。これは、LegacyUpdateと同じような仕組みです。

もうちょっと詳しく説明すると、WSUS Proxyをサービスとして登録するということです。Legacy UpdateはWebで更新しますが、VistaUpdaterはWindows Update (自動更新)に対応しています。(LUも対応してます)

## 最後に

VistaUpdaterはもう少しで復帰します。VistaUpdaterが復帰するまでは、ダウンロードを閉鎖しようと考えています。ご不便おかけし申し訳ございません。
