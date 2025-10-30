# 聯絡我們

想合作或有問題，歡迎來信：**contact@your-domain.example**

> 如果你想用靜態站的表單服務，可整合第三方（如 Formspree / Basin），
> 之後我們可以幫你加上表單與驗證。

---

## 線上表單（示例）

> 你可以到 Formspree / Basin 申請表單端點，將 action URL 換掉即可。

<form action="https://formspree.io/f/your-endpoint" method="POST">
  <label>姓名<br/><input type="text" name="name" required/></label><br/><br/>
  <label>Email<br/><input type="email" name="email" required/></label><br/><br/>
  <label>主題<br/><input type="text" name="subject" /></label><br/><br/>
  <label>訊息<br/><textarea name="message" rows="6" required></textarea></label><br/><br/>
  <button type="submit">送出</button>
</form>
