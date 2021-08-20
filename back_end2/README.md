# MONGODBサーバー

## 
- TEST_data_TEST Userを
SERVER

TESTはDeveloper のユーザーを作成するか、またはアクセス制限をしたユーザーを使う（オープンソースのため）

- User Data
  - id
  - name
  - hashed_password
  - isVerify
  - iconURL


## やること
- まず初めにUSER認証をする
-

## Mongodb
use <db>  switch the database
show collections / dbs 
db.<name>.<command>

## USER 認証
- ユーザー登録されていない場合
  1. ログイン画面
  1. ユーザー登録画面へ遷移
  1. メールアドレスとユーザーネームから既存のアカウントでないことを確認
  1. サーバー側にユーザー作成Tokenをリクエスト
  1. サーバー側から認証メールを送る
  1. クライアントからTokenを受け取り、サーバー側がTokenを用い認証
  1. ユーザー名、パスワードを入力（パスワード強度の確認）
  1. サーバー側に送られたパスワードは、hash化されてMongoDBに保存
  1. ログイン画面
- ユーザー登録されている場合
  1. ログイン画面
  1. ユーザー名、パスワードをサーバー側へ送信
  1. ハッシュと見比べる
  1. ホーム画面
- ユーザー削除する場合
  - アカウント認証されている場合
    1. Setting画面から削除
    1. ログイン画面
  - ユーザー名、パスワードを忘れた場合
    1. ログイン画面
    1. アカウント削除画面へ遷移
    1. Tokenをサーバー側にリクエスト
    1. メールアドレス宛にTokenを送信
    1. Tokenを元に認証し、アカウントの削除
    1. ログイン画面
- パスワードを忘れた場合
  1. ログイン画面
  1. パスワード再発行画面へ遷移
  1. サーバー側へTokenをリクエスト
  1. Tokenをメールアドレスへ送信
  1. Token認証
  1. 新しいパスワードの登録
  1. ログイン画面

## ルーム情報
- ルームはユーザーにタグ付けられた
- 

## データ情報
- User
  - uuid                      UUID
  - userID                    ユーザ情報(unique)
  - email                     メールアドレス
  - username                  ユーザーの名前
  - hashedPassWord            パスワードをハッシュ化したやつ
  - isVerify                  認証されたUserかどうか
  - room_list                 roomID(room作成時に作られるuniqueな名前)
  - friends_list              userIDのリスト
- Room
  - roomID(hashed)            room
  - roomName                  ルーム名
  - roomIcon                  アイコンのurl
  - status                    ["muted", "active", "blocked"]
  - userList                  そのルームに所属しているuserIDのリスト
- Message
  - roomID(hashed)            ハッシュ化されたroomID roomIDからの検索に使う
  - userID(hashed)            ハッシュ化されたuserID userIDからの検索に使う
  - body                      メインのメッセージ
  - reactions                 リアクションのリスト
- Tokens
  - data
  - 

- Profiels
  - UserID(hashed)






