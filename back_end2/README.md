# MONGODBサーバー

## 
- TEST_data_TEST Userを
SERVER

TESTはDeveloper のユーザーを作成するか、またはアクセス制限をしたユーザーを使う（オープンソースのため）



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
  - userUUID                  UUID
  - userID                    ユーザ情報(unique)
  - email                     メールアドレス
  - username                  ユーザーの名前
  - hashedPassWord            パスワードをハッシュ化したやつ
  - roomList                 roomID(room作成時に作られるuniqueな名前)
    - {id: 'str', status: {"muted/active/blocked/inviting"}}
  - friendsList              userIDのリスト
  - profiles
    - age
    - birthday
    - grade
    - links
    - iconURL
    - message
- Room
  - roomUUID                  room
  - roomName                  ルーム名
  - discription               概要
  - roomIcon                  アイコンのurl
  - type                      ["open", "direct", "restricted"]
  - userList                  null / そのルームに所属しているuserUUIDのリスト
  - tags
- Message
  - roomUUID                  ハッシュ化されたroomID roomIDからの検索に使う   :: index
  - userUUID                  ハッシュ化されたuserID userIDからの検索に使う [ null, 'user_id' ]
  - messageType               ['text', 'file', 'media']
  - body                      メインのメッセージ
  - reactions                 リアクションのリスト
  - route                     null / message_id
  - date                                                                      :: index
- Tokens
  - email
  - token
  - date
  - isVerify
  - expired

## room
- frend登録の仕方？
  - 同じroomに所属する人にrequest
  - userid / profile をもとに検索してrequest
    - 検索項目絞り込みができる
  - UI
    - 制限ルームのメンバーリスト
    -

- roomに招待?
  - openRoom
    - Room名から検索できる
  - restrictedRoom
    - Room内にいるユーザーから、招待をできる


### どうやって、招待通知をするか
- Archive につける？
## profile


## Memo
- UUIDと_idを区別するかは保留　検索能力等による










