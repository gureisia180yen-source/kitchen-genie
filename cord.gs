// @ts-ignore
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

function generatePrompt(form) {
  const ingredients = form.ingredients || [];
  const priority = form.priority || [];
  const extra = form.extra || "";
  const missing = form.missing || [];
  const mood = form.mood || "";
  const servingsText = form.servings;
  const amounts = form.amounts || {};  // ★ ここで受け取る！

  const ingredientsWithAmount = ingredients.map(name => {
    const amount = amounts[name] || "普通";
    const isPriority = priority.includes(name);
    const mark = isPriority ? "★" : "";
    return `${mark}${name}（量：${amount}）`;
  });

  // 食材リスト
  let ingText = ingredientsWithAmount.join("、 ");
  if (extra) ingText += "、 " + extra;

  // 調味料
  const allSeasonings = ["塩", "砂糖", "醤油", "めんつゆ", "みりん", "料理酒", "味噌", "ごま油", "サラダ油", "バター", "しょうがチューブ", "にんにくチューブ", "コンソメ", "鶏がらスープの素", "ケチャップ", "マヨネーズ"];
  const availableSeasonings = allSeasonings.filter(s => !missing.includes(s));
  const availableText = availableSeasonings.join(", ");

  // テンプレ
  const templates = {
    "easy": `以下の食材を使って料理を作ってください。

条件
・新しい食材は追加しない
・すべての食材を使用する必要はない
・家庭料理
・調理が簡単
・調理にかかる手間を可能な限り抑える
・一般的に保存がきかないとされる食材を優先的に使う
・★マークのついた食材は更に優先的に使う
・{{SERVINGS}}人前の量で作ること
・各食材の使用量はユーザーが指定した量以下とすること

【食材】
{{ING}}

【使用可能な調味料】
{{OK}}`,

    "taste": `以下の食材を使って料理を作ってください。

条件
・新しい食材は追加しない
・すべての食材を使用する必要はない
・家庭料理
・味重視
・一般的に保存がきかないとされる食材を優先的に使う
・★マークのついた食材は更に優先的に使う
・{{SERVINGS}}人前の量で作ること
・各食材の使用量はユーザーが指定した量以下とすること

【食材】
{{ING}}

【使用可能な調味料】
{{OK}}`,

    "health": `以下の食材を使って料理を作ってください。

条件
・新しい食材は追加しない
・すべての食材を使用する必要はない
・家庭料理
・健康面に配慮
・レシピ内にカロリー数、塩分含有量を記載する
・一般的に保存がきかないとされる食材を優先的に使う
・★マークのついた食材は更に優先的に使う
・{{SERVINGS}}人前の量で作ること
・各食材の使用量はユーザーが指定した量以下とすること

【食材】
{{ING}}

【使用可能な調味料】
{{OK}}`,
  };

  const template = templates[mood];

  return template
    .replace("{{ING}}", ingText)
    .replace("{{OK}}", availableText)
    .replace("{{SERVINGS}}", servingsText);
}
