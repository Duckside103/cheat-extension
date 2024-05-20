let currentIndex = 0;

document.addEventListener("click", (e) => {
  if (e.shiftKey) {
    action();
  }
});

document.addEventListener("keypress", (e) => {
  if (e.key === "+") {
    currentIndex = currentIndex + 1;
    test();
  }
});

test();

async function test() {
  const answers = await getAnswer();

  const target = document.querySelector(
    ".container3d.relative a.default_t_color"
  );
  const targetParent = document.querySelector(".container3d.relative");
  target?.parentNode?.removeChild(target);

  const badge = document.createElement("a");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("default_t_color");

  if (currentIndex === answers.length || answers?.length === 0) {
    currentIndex = 0;
  }
  console.log(">> Check | test | answers:", { answers, currentIndex });
  if (answers[currentIndex]) {
    badge.textContent = `My Dashboard ${answers[currentIndex].number}:${answers[currentIndex].answer}`;

    targetParent?.insertBefore(badge, targetParent.firstChild);
  }

  async function getAnswer() {
    const data = await fetch("http://localhost:3000/answer");
    const answers = await data.json();

    return answers?.result;
  }
}

async function action() {
  let data = handleData(document.body.innerHTML);

  await fetch("http://localhost:3000/question/", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  });
}

function stripScripts(s) {
  let div = document.createElement("div");
  div.innerHTML = s;
  let scripts = div.getElementsByTagName("script");
  let i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}

function stripInfos(s) {
  let div = document.createElement("div");
  div.innerHTML = s;
  let header = div.querySelector('header[role="banner"]');
  let footer = div.querySelector("footer#footer");
  let breadcrumbs = div.querySelector(".breadcrumbs");
  let infos = div.querySelector(
    "div.region.region-social-widget.region-social-widget"
  );

  header?.parentNode?.removeChild(header);
  footer?.parentNode?.removeChild(footer);
  infos?.parentNode?.removeChild(infos);
  breadcrumbs?.parentNode?.removeChild(breadcrumbs);

  return div.innerHTML;
}

function handleData(html) {
  try {
    let noScripts = stripScripts(html);
    let noHeaderFooter = stripInfos(noScripts);

    return noHeaderFooter.replace(/  |\r\n|\n|\r/gm, "");
  } catch (error) {
    console.error("OI KHONG LOI ROI :(", error);
  }
}
