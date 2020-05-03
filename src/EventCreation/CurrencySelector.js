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
        placeholder="Please select a category"

        name="eventCategory"
        value={props.value}
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
/*

const currencies2 = {
    "United States Dollar (USD) $": "US$",
    "Canada Dollar (CAD) $": "CA$",
    "Mexico Peso (MXN) $": "MX$",
    "Euro Member Countries (EUR) €": "€",
    "United Kingdom Pound (GBP) £": "£",
    "Czech Republic Koruna (CZK) Kc": "Kc",
    "Denmark Krone (DKK) kr": "kr",
    "Hungary Forint (HUF) Ft": "Ft",
    "Norway Krone (NOK) kr": "kr",
    "Poland Zloty (PLN) zl": "zl",
    "Sweden Krona (SEK) kr": "kr",
    "Switzerland Franc (CHF) CHF": "CHF",
    "Japan Yen (JPY) ¥": "¥",
    "Australia Dollar (AUD) $": "$",
    "New Zealand Dollar (NZD) $": "$",
    "Hong Kong Dollar (HKD) $": "$",
    "Singapore Dollar (SGD) $": "$",
    "Israel Shekel (ILS) ₪": "₪",
    "Philippines Peso (PHP) ₱": "₱",
    "Taiwan New Dollar (TWD) NT$": "NT$",
    "Thailand Baht (THB) ฿": "฿",
    "Russia Ruble (RUB) ₽": "₽",
}

*/
export default CurrencySelector;