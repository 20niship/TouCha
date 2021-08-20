# TouCha

<p>
  <!-- iOS -->
  <a href="https://itunes.apple.com/app/apple-store/id982107779">
    <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  </a>
  <!-- Android -->
  <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=blankexample">
    <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  </a>
  <!-- Web -->
  <a href="https://docs.expo.io/workflow/web/">
    <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
  </a>
</p>

## TouChaとは
- 2021年3月11日設立の東大プログラミングサークルTouChaによるプロジェクト
- 東大生による、東大生のための東大生用チャットアプリ
- オフラインで人と会う機会がほとんどない東大生同士が、情報交換したり友達づくりができる。このアプリを通して自分も共同体に属して活動しているという感覚を持ってもらえたら良い

## 製作の動機
- 大学1年生時のサークル長の体験と、後輩たちに同じ思いをして欲しくないという強い思いから生まれた。
  - コロナ禍により東大生どうしの交流が激減した。サークル長は大学1年生としての大学生活のほとんどをオンライン授業のみで過ごしてきたが、友達もできず家の中で過ごすだけの日々を送り、とても寂しい思いをした。

## 使用言語
- JavaScript, React Native, Node.js

## How to build
- フロントエンド
  - `$ cd front_end`
  - `$ npm start`
  - expoが動き出すので、ブラウザやスマホからデバッグして下さい
- バックエンド
  - 事前にMongoDBを起動しておいて下さい。
  - `$ cd back_end`
  - `$ npm main.js`
  - main.jsが起動した状態でターミナルになにか文字を入力して<kbd>Enter</kbd>を押すと、MongoDBにテストデータが書き込まれます。


## dependancies
- front_end, backendともにnpmでパッケージを管理しているので、それぞれのフォルダに行って、`npm install`をすれば必要なライブラリをインストールできます。
- できなかったらSlackで聞いてね
