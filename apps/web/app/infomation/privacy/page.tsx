// PrivacyPolicy.tsx
import Link from "next/link";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen mt-16 p-8">
      <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
      <p className="mb-6 text-base leading-relaxed">雷は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、アカウントの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>
      <h1 className="text-xl font-bold mb-4">第1条（個人情報）</h1>
      <p className="mb-6 text-base leading-relaxed">「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。</p>
      <h1 className="text-xl font-bold mb-4">第2条（個人情報の収集方法）</h1>
      <p className="mb-6 text-base leading-relaxed">雷は、アカウントが利用登録をする際に、メールアドレスなどの個人情報をお尋ねすることがあります。</p>
      <h1 className="text-xl font-bold mb-4">第3条（個人情報を収集・利用・提供する目的）</h1>
      <p className="mb-6 text-base leading-relaxed">雷が個人情報を収集・利用する目的は，以下のとおりです。</p>
      <div className="mb-6 text-base leading-relaxed">
        <ol className="list-decimal list-inside">
          <li>アカウントが本人なのかを確認するため。</li>
          <li>利用規約等に違反したアカウントのご利用をお断りするため。</li>
          <li>アカウントにご自身の登録情報の閲覧、編集、削除を行っていただくため。</li>
          <li>雷は、どんな場合でも、個人情報を第三者に提供することはありません。</li>
          <li>上記の利用目的に付随する目的</li>
        </ol>
      </div>
      <h1 className="text-xl font-bold mb-4">第4条（利用目的・プライバシーポリシーの変更）</h1>
      <p className="mb-6 text-base leading-relaxed">利用目的やプライバシーポリシーの変更を行った場合には、ウェブサイトで利用目的の変更をしたことを通知します。</p>
      <h1 className="text-xl font-bold mb-4">第5条（お問い合わせ）</h1>
      <p className="mb-6 text-base leading-relaxed">
        本ポリシーやウェブサイトに関するお問い合わせは、
        <Link href="/#contact" className="text-blue-400 underline">
          こちら
        </Link>
        をご覧ください。
      </p>
    </div>  );
};

export default PrivacyPolicy;
