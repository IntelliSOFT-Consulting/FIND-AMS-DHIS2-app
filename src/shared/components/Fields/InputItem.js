import React from "react";
import {Checkbox, DatePicker, Input, Radio, Select, Upload} from "antd";

export default function InputItem({type, name, fileUploadProps, ...props}) {

    const renderInput = () => {

        const disabledDate = current => {
            return current && current.valueOf() > Date.now()
        }

        switch (type) {

            case "TEXT":
                return <Input name={name} {...props} />;

            case "BOOLEAN":
                return (
                    <Radio.Group name={name} {...props}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Radio.Group>
                );

            case "SELECT":
                return <Select showSearch name={name} {...props} />;

            case "RADIO":
                return <Radio.Group showSearch name={name} {...props} />;

            case "DATE":
                return (
                    <DatePicker
                        disabledDate={disabledDate}
                        name={name}
                        {...props}
                        format="YYYY-MM-DD"
                        style={{
                            width: "100%",
                        }}
                    />
                );

            case "MULTI_TEXT":
                return (
                    <Checkbox.Group style={{display: "grid", gridTemplateColumns: "1fr 1fr"}} name={name} {...props} />
                )

            case "LONG_TEXT":
                return <Input.TextArea rows={4} name={name} {...props} />;


            case "FILE_RESOURCE":
                return <Upload.Dragger style={{width: "100%"}} name={name}  {...fileUploadProps} />;

            default:
                return <Input name={name} {...props} />;
        }
    };
    return renderInput();
}
