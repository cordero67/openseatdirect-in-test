import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'

class YearPicker extends React.Component {
    state = {
        value: { label: "NT$", value: "Default currency" },
    }

    options = [

        { label: "United States Dollar (USD) $", value: "US$" },
        { label: "United States Dollar (USD) $", value: "CA$" },
        { label: "Mexico Peso (MXN) $", value: "MX$" }
    ]

    handleChange(Newvalue) {
        this.setState({ value: {label: Newvalue.value, value: Newvalue.label}})
        console.log("value ",Newvalue)
    }

    render() {
        return (
            <Select
                options={this.options}
                value={this.state.value}
                onChange={value => this.handleChange(value)}
                defaultValue={{ label: 2002, value: 2002 }}
            />
        )
    }
}

export default YearPicker