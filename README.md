# Gulp-Webpack-Starter
Gulp Webpack Starter - fast static website builder. The starter uses gulp toolkit and webpack bundler. 

## Import sidebar via CSV file
- CSVファイルでサイドバーに書籍の目次をインポートするためのコマンド
```bash
./vendor/bin/sail artisan import:sidebar-csv
```
- CSVのパス: `database/seeders/categories/dataSidebar.csv`
- 作成者: [白銀さんから頂いたgoogle sheet](https://docs.google.com/spreadsheets/d/1pXno_BOS5Ld_tKOR1SQKfvAEYH6p0SHTB8YZh7nw0U4/edit?gid=208613888#gid=208613888) に基づいて、Coder VyがCSVを作りました。
- タスク名：[【036】サイドバー改修_法令編Ⅱ.Ⅲ.Ⅳ](https://dokidokigw-dsd.slack.com/lists/TMXFH57HB/F09EPC4SQBY?record_id=Rec09NWQLHK5M)
- 影響範囲: 法令編のII, III, IV です。（Iを除く）。
CSVファイルを読み込む、`generated-sidebar-csv.blade.php`ファイルを生成する、
`<x-tensuhyo.generated-sidebar-csv />` を呼び出して、`sidebar-body.blade.php`ファイル内でサイドバーの目次を表示する。
