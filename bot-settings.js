(() => {
  const defaults = () => ({
    name: "售票網客服小幫手",
    desktopTitle: "udn 售票網小幫手",
    desktopText: "嗨！我是智能客服小 U，很高興為您服務",
    mobileText: "嗨！聊聊吧",
    position: "bottom-right",
    horizontal: 24,
    vertical: 24,
    theme: "#409EFF",
    themeText: "#FFFFFF",
    background: "#F4F7F9",
    welcome:
      "<p>您好！我是 udn 售票網智能客服小 U，很高興為您服務。<br>點擊下方「開始吧」按鈕，我可以快速回答你喔！</p>",
    icon: "",
    logo: "",
    banner: "",
    avatar: "",
  });
  const imageFields = [
    {
      key: "icon",
      label: "啟動 icon",
      accept: "image/png",
      help: "限 PNG 格式，建議尺寸 120 × 120 px，檔案須小於 500 KB。",
      maxBytesExclusive: 500 * 1024,
      required: true,
    },
    {
      key: "logo",
      label: "產品 Logo 圖檔",
      accept: "image/png",
      help: "限 PNG 格式，建議尺寸 80 × 80 px，檔案須小於 500 KB。",
      maxBytesExclusive: 500 * 1024,
    },
    {
      key: "banner",
      label: "上方背景圖",
      accept: "image/jpeg",
      help: "限 JPG 格式，建議尺寸 768 × 256 px，檔案須小於 1 MB。",
      maxBytesExclusive: 500 * 1024,
    },
    {
      key: "avatar",
      label: "BOT 對話肖像圖",
      accept: "image/png",
      help: "限 PNG 格式，建議尺寸 120 × 120 px，檔案須小於 500 KB。",
      maxBytesExclusive: 500 * 1024,
    },
  ];
  const root = document.createElement("main");
  root.className = "management-page bot-settings-page";
  root.hidden = true;
  document.body.append(root);
  root.innerHTML = `<header class="keyword-heading"><h1>BOT 樣式設定</h1></header>
  <el-form label-position="top" class="bot-settings-form" @submit.native.prevent>
    <section class="bot-settings-section"><h2>基本設定</h2><div class="bot-settings-grid bot-basic-grid">
      <el-form-item label="產品 / 服務名稱" required :error="errors.name"><el-input v-model="form.name" maxlength="30" show-word-limit placeholder="請輸入產品或服務名稱"></el-input></el-form-item>
      <el-form-item label="桌機版招呼標題 (8～10 字)" required :error="errors.desktopTitle"><el-input v-model="form.desktopTitle" placeholder="請輸入招呼標題"></el-input></el-form-item>
      <el-form-item label="手機版招呼標題 (5 字以內)" required :error="errors.mobileText"><el-input v-model="form.mobileText" placeholder="請輸入手機版招呼內容"></el-input></el-form-item>
      <el-form-item label="桌機版招呼內容 (18~20 字)" required :error="errors.desktopText"><el-input v-model="form.desktopText" placeholder="請輸入招呼內容"></el-input></el-form-item>
      <div class="bot-upload-field"><label class="bot-field-label"><span class="required-mark">*</span>啟動 icon</label><el-upload class="bot-drag-upload" drag action="#" :show-file-list="false" :before-upload="file => prepareUpload(file, 'icon')" aria-label="上傳啟動 icon"><img v-if="form.icon" class="bot-upload-preview" :src="form.icon" alt="啟動 icon 預覽"><template v-else><i class="el-icon-upload"></i><div class="el-upload__text">將檔案拖曳至此，或<em>點擊上傳</em></div></template></el-upload><p class="bot-field-hint">{{ fields.icon.help }}</p><p v-if="imageErrors.icon" class="bot-field-error" role="alert">{{ imageErrors.icon }}</p></div>
      <div class="bot-basic-colors"><el-form-item v-for="color in colors.slice(0,2)" :key="color.key" :label="color.label" required :error="errors[color.key]"><div class="bot-color"><el-input :value="form[color.key]" @input="setHex(color.key,$event)" :aria-label="color.label+' Hex 色碼'" maxlength="7"></el-input><input type="color" :value="pickerColors[color.key]" :aria-label="color.label+'選色'" @input="setHex(color.key,$event.target.value)"></div></el-form-item></div>
    </div></section>
    <section class="bot-settings-section"><h2>歡迎頁設定</h2><div class="bot-settings-grid">
      <div v-for="key in ['logo','banner']" :key="key" class="bot-upload-field"><label class="bot-field-label">{{ fields[key].label }}</label><el-upload class="bot-drag-upload" drag action="#" :show-file-list="false" :before-upload="file => prepareUpload(file, key)" :aria-label="'上傳'+fields[key].label"><img v-if="form[key]" class="bot-upload-preview" :src="form[key]" :alt="fields[key].label+'預覽'"><template v-else><i class="el-icon-upload"></i><div class="el-upload__text">將檔案拖曳至此，或<em>點擊上傳</em></div></template></el-upload><p class="bot-field-hint">{{ fields[key].help }}</p><p v-if="imageErrors[key]" class="bot-field-error" role="alert">{{ imageErrors[key] }}</p></div>
      <el-form-item class="bot-grid-wide" label="歡迎頁文案" required :error="errors.welcome"><div ref="welcomeEditor" class="bot-welcome-editor"></div><p class="bot-field-hint" :class="{'bot-count-over':welcomeCount>85}">目前字數：{{ welcomeCount }} / 85 字</p></el-form-item>
    </div></section>
    <section class="bot-settings-section"><h2>對話頁設定</h2><div class="bot-settings-grid"><div class="bot-upload-field"><label class="bot-field-label">BOT 對話肖像圖</label><el-upload class="bot-drag-upload" drag action="#" :show-file-list="false" :before-upload="file => prepareUpload(file, 'avatar')" aria-label="上傳 BOT 對話肖像圖"><img v-if="form.avatar" class="bot-upload-preview" :src="form.avatar" alt="BOT 對話肖像預覽"><template v-else><i class="el-icon-upload"></i><div class="el-upload__text">將檔案拖曳至此，或<em>點擊上傳</em></div></template></el-upload><p class="bot-field-hint">{{ fields.avatar.help }}</p><p v-if="imageErrors.avatar" class="bot-field-error" role="alert">{{ imageErrors.avatar }}</p></div><el-form-item label="對話頁背景色" required :error="errors.background"><div class="bot-color"><el-input :value="form.background" @input="setHex('background',$event)" aria-label="對話頁背景色 Hex 色碼" maxlength="7"></el-input><input type="color" :value="pickerColors.background" aria-label="對話頁背景色選色" @input="setHex('background',$event.target.value)"></div></el-form-item></div></section>
  <div class="bot-settings-actions"><el-button @click="reset">還原預設值</el-button><el-button type="primary" @click="save">儲存</el-button></div></el-form>`;
  let saved;
  try {
    saved = JSON.parse(
      localStorage.getItem("ccbot-bot-style-settings") || "null",
    );
  } catch (_) {
    saved = null;
  }
  const initial = { ...defaults(), ...(saved || {}) };
  let welcomeEditor;
  const app = new Vue({
    el: root,
    data: {
      form: initial,
      pickerColors: {
        theme: initial.theme,
        themeText: initial.themeText,
        background: initial.background,
      },
      fields: Object.fromEntries(imageFields.map((f) => [f.key, f])),
      imageErrors: {},
      errors: {},
      colors: [
        { key: "theme", label: "主題色" },
        { key: "themeText", label: "主題色對應文字顏色" },
      ],
      uploadTokens: {},
    },
    mounted() {
      welcomeEditor = new Quill(this.$refs.welcomeEditor, {
        theme: "snow",
        placeholder: "請輸入歡迎頁文案",
        modules: {
          toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
            ["link"],
          ],
        },
      });
      welcomeEditor.root.setAttribute("aria-label", "歡迎頁文案");
      welcomeEditor.clipboard.dangerouslyPasteHTML(this.form.welcome, "silent");
      welcomeEditor.on("text-change", () => {
        this.form.welcome = welcomeEditor.root.innerHTML;
      });
    },
    computed: {
      horizontalLabel() {
        return this.form.position.endsWith("left") ? "距離左側" : "距離右側";
      },
      verticalLabel() {
        return this.form.position.startsWith("top") ? "距離上方" : "距離下方";
      },
      welcomeCount() {
        const doc = new DOMParser().parseFromString(
          this.form.welcome,
          "text/html",
        );
        return Array.from(doc.body.textContent || "").length;
      },
    },
    methods: {
      validHex(value) {
        return /^#[0-9A-F]{6}$/i.test(value);
      },
      setHex(key, value) {
        this.form[key] = value.toUpperCase();
        const valid = this.validHex(this.form[key]);
        if (valid) this.pickerColors[key] = this.form[key];
        this.$set(
          this.errors,
          key,
          valid ? "" : "請輸入有效的 Hex 色碼，例如 #FFFFFF",
        );
      },
      prepareUpload(file, key) {
        this.upload(file, key);
        return false;
      },
      upload(file, key) {
        const token = (this.uploadTokens[key] || 0) + 1;
        this.$set(this.uploadTokens, key, token);
        this.$set(this.imageErrors, key, "");
        if (file.type !== this.fields[key].accept) {
          this.form[key] = "";
          this.$set(this.imageErrors, key, "檔案格式不符");
          return;
        }
        if (
          this.fields[key].maxBytesExclusive
            ? file.size >= this.fields[key].maxBytesExclusive
            : file.size > 1024 * 1024
        ) {
          this.form[key] = "";
          this.$set(this.imageErrors, key, "檔案大小超過限制");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (this.uploadTokens[key] === token) this.form[key] = reader.result;
        };
        reader.onerror = () => {
          if (this.uploadTokens[key] === token) {
            this.form[key] = "";
            this.$set(this.imageErrors, key, "無法讀取圖片，請重新上傳");
          }
        };
        reader.readAsDataURL(file);
      },
      reset() {
        Object.keys(this.uploadTokens).forEach(
          (key) => this.uploadTokens[key]++,
        );
        this.form = defaults();
        welcomeEditor.clipboard.dangerouslyPasteHTML(
          this.form.welcome,
          "silent",
        );
        this.pickerColors = {
          theme: this.form.theme,
          themeText: this.form.themeText,
          background: this.form.background,
        };
        this.errors = {};
        this.imageErrors = {};
        this.$message.success("已還原至預設配置");
      },
      save() {
        const e = {};
        [
          ["name", "請輸入產品 / 服務名稱"],
          ["desktopTitle", "請輸入桌機版招呼標題"],
          ["desktopText", "請輸入桌機版招呼內容"],
          ["mobileText", "請輸入手機版招呼文案"],
        ].forEach(([key, message]) => {
          if (!this.form[key].trim()) e[key] = message;
        });
        if (!this.welcomeCount || !this.form.welcome.trim())
          e.welcome = "請輸入歡迎頁文案";
        ["horizontal", "vertical"].forEach((key) => {
          if (!Number.isInteger(this.form[key]) || this.form[key] < 1)
            e[key] = "請輸入正整數";
        });
        ["theme", "themeText", "background"].forEach((key) => {
          if (!this.validHex(this.form[key]))
            e[key] = "請輸入有效的 Hex 色碼，例如 #FFFFFF";
        });
        this.errors = e;
        if (
          Object.keys(e).length ||
          Object.values(this.imageErrors).some(Boolean)
        ) {
          this.$message.error("請檢查設定欄位");
          return;
        }
        try {
          localStorage.setItem(
            "ccbot-bot-style-settings",
            JSON.stringify(this.form),
          );
          this.$message.success("設定已儲存");
        } catch (_) {
          this.$message.error("儲存失敗，請減少圖片大小後重試");
        }
      },
    },
  });
  function render() {
    const active = location.hash === "#bot-style-settings";
    app.$el.hidden = !active;
    const link = document.querySelector('a[href="#bot-style-settings"]');
    link.removeAttribute("aria-current");
    if (!active) return;
    link.setAttribute("aria-current", "page");
    document.querySelectorAll(".nav-group").forEach((group, index) => {
      group.open = index === 3;
    });
    document.title = "BOT 樣式設定 | C.C. Bot";
    document.querySelector(".service-crumbs").innerHTML =
      '<span>/</span> BOT 管理 <span class="monitor-breadcrumb"></span><span>/</span> <span aria-current="page">BOT 樣式設定</span>';
  }
  window.addEventListener("hashchange", render);
  render();
  window.botSettingsApp = app;
})();
