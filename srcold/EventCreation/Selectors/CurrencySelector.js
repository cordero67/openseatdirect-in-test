import React from "react";

const CurrencySelector = (props) => {

    return (
        <select
        style={{
            padding: "9px 10px",
            border: "1px solid lightgrey",
            boxSizing: "borderBox",
            width: "300px",
            lineHeight: "1.75",
            cursor: "pointer"}}
        type="text"
        id="input box ticket description"
        name={props.name}
        value={props.current}
        onChange={props.change}
        required
        >
            
            <option style={{fontWeight: "bold"}} disabled>Americas</option>
            <option value="USD $">United States Dollar (USD) $</option>
            <option value="CAD $">Canada Dollar (CAD) $</option>
            <option value="MXN $">Mexico Peso (MXN) $</option>
            <option style={{fontWeight: "bold"}} disabled>Europe</option>
            <option value="EUR €">Euro Member Countries (EUR) €</option>
            <option value="GBP £">United Kingdom Pound (GBP) £</option>
            <option value="CZK Kc">Czech Republic Koruna (CZK) Kc</option>
            <option value="DKK kr">Denmark Krone (DKK) kr</option>
            <option value="HUF Ft">Hungary Forint (HUF) Ft</option>
            <option value="NOK kr">Norway Krone (NOK) kr</option>
            <option value="PLN zl">Poland Zloty (PLN) zl</option>
            <option value="SEK kr">Sweden Krona (SEK) kr</option>
            <option value="CHF">Switzerland Franc (CHF) CHF</option>
            <option style={{fontWeight: "bold"}} disabled>Asia</option>
            <option value="JPY ¥">Japan Yen (JPY) ¥</option>
            <option value="AUD $">Australia Dollar (AUD) $</option>
            <option value="NZD $">New Zealand Dollar (NZD) $</option>
            <option value="HKD $">Hong Kong Dollar (HKD) $</option>
            <option value="SGD $">Singapore Dollar (SGD) $</option>
            <option value="ILS ₪">Israel Shekel (ILS) ₪</option>
            <option value="PHP ₱">Philippines Peso (PHP) ₱</option>
            <option value="TWD NT$">Taiwan New Dollar (TWD) NT$</option>
            <option value="THB ฿">Thailand Baht (THB) ฿</option>
            <option value="RUB ₽">Russia Ruble (RUB) ₽</option>
            <option style={{display: "none"}} value="default" disabled>Choose a currency</option>
        </select>
    )
}

export default CurrencySelector;