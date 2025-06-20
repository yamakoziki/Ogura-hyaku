# 小倉百人一首競技システム - デスクトップ利用ガイド

## 🖥️ Mac/Windows での使用方法

### 方法1: 直接ブラウザで開く（最も簡単）
1. 以下4つのファイルを同じフォルダにダウンロード：
   - `index.html`
   - `style.css` 
   - `script.js`
   - `karuta-data.js`

2. `index.html` をダブルクリックしてブラウザで開く

### 方法2: ローカルサーバーで起動（推奨）

#### Mac の場合
```bash
# ターミナルを開く
cd ~/Downloads/karuta  # ファイルを保存したフォルダに移動
python3 -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

#### Windows の場合
```cmd
# コマンドプロンプトを開く
cd C:\Users\Username\Downloads\karuta  # ファイルを保存したフォルダに移動
python -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

### 方法3: Node.jsのlive-serverを使用
```bash
# Node.jsがインストールされている場合
npx live-server
# 自動でブラウザが開きます
```

## 🎯 使用時の注意点

### 音声読み上げについて
- **Mac**: 標準でかなり良い日本語音声エンジンを搭載
- **Windows**: Windows 10/11では日本語音声パック要インストール
- **Chrome/Edge**: Web Speech APIに対応、高品質な読み上げ
- **Safari**: Macのシステム音声を使用

### ショートカットキー（ブラウザで利用可能）
- `F11`: フルスクリーン表示
- `Ctrl/Cmd + 0`: ズームリセット
- `Ctrl/Cmd + +/-`: 文字サイズ調整

## 🚀 デスクトップアプリ化

### Electronアプリ化
```bash
npm install -g electron
# package.jsonとmain.jsを追加してアプリ化可能
```

### PWA（Progressive Web App）として利用
- Chromeで「アプリをインストール」から追加可能
- デスクトップにショートカットが作成されます

## 📁 ファイル構成
```
karuta/
├── index.html      # メインページ
├── style.css       # 和風デザイン
├── script.js       # 機能実装
└── karuta-data.js  # 百人一首データ
```

## 🎨 カスタマイズ
- `karuta-data.js`: 残り90首を追加可能
- `style.css`: 色合いやフォントサイズの調整
- `script.js`: 追加機能の実装

## ⚡ パフォーマンス最適化
- オフラインでも動作（データはローカル保存）
- 軽量設計でサクサク動作
- メモリ使用量が少ない