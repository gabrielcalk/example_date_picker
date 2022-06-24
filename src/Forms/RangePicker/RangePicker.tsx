import React, { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Menu, Row, Tag } from "antd";
import moment from "moment";

// ==== Data ====
// import COLORS from "assets/styles/config/colors.json";

const RangePicker2 = (props: any) => {
  const dateFormats = ["MM-DD-YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "YYYY/MM/DD"];
  const [id] = useState(() => Math.floor(Math.random() * (99999999 - 1) + 1));
  const [startDate, setStartDate] = useState(
    props.value ? moment(props.value.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    props.value ? moment(props.value.endDate) : null
  );
  const [endOpen, setEndOpen] = useState(false);
  const [dateKey, setDateKey] = useState(null);

  useEffect(() => {
    if (props.dateKey) {
      setDateKey(props.dateKey);
      if (props.dateKey.length && props.dateRanges) {
        setStartDate(moment().endOf("day"));
        setEndDate(moment().endOf("day"));
      }
    }
  }, [props.dateKey, props.dateRanges]);

  useEffect(() => {
    if (props.value.startDate) {
      setStartDate(moment(props.value.startDate));
    }
    if (props.value.endDate) {
      setEndDate(moment(props.value.endDate));
    }
    setDateKey(props.dateKey || null);
  }, [props.dateKey, props.value.startDate, props.value.endDate]);

  const onStartChange = (date: any) => {
    setDateKey(null);
    setStartDate(date);
    setEndDate(null);
  };

  const onEndChange = (date: moment.Moment | null) => {
    setDateKey(null);
    setEndDate(date);
    if (startDate && date) {
      props.onChange([startDate, date]);
    }
  };

  const customRangeClick = (e: any, event: any) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    setStartDate(moment(props.dateRanges[e].from));
    setEndDate(moment(props.dateRanges[e].to));
    setDateKey(e);
    props.onChange([props.dateRanges[e].from, props.dateRanges[e].to], e);
  };

  return (
    <Row align="top" id={id as any} className="rangePickerWrapper">
      <DatePicker
        allowClear={false}
        disabledDate={(current) => {
          if (!current || !endDate) {
            return false;
          }
          return current.isAfter(endDate) || props.disabledDatesFn(current);
        }}
        format={[props.format || "YYYY-MM-DD", ...dateFormats]}
        // getCalendarContainer={() => document.getElementById(id as any)}
        onChange={onStartChange}
        onOpenChange={(open) => {
          if (!open) setEndOpen(true);
        }}
        placeholder="Min"
        style={{
          borderRight: 0,
          marginRight: -2,
          width: "calc(50% - 25px)"
        }}
        suffixIcon={<></>}
        value={startDate}
      />
      <Input
        disabled
        placeholder="~"
        style={{
          backgroundColor: "white",
          borderLeft: 0,
          borderRadius: 0,
          borderRight: 0,
          height: 32,
          padding: 0,
          pointerEvents: "none",
          width: 20,
          zIndex: 1
        }}
      />
      <DatePicker
        allowClear={false}
        disabledDate={(current) => {
          if (!current || !startDate) {
            return false;
          }
          return !current.isAfter(startDate) || props.disabledDatesFn(current);
        }}
        format={[props.format || "YYYY-MM-DD", ...dateFormats]}
        // getCalendarContainer={() => document.getElementById(id as any)}
        onChange={onEndChange}
        onOpenChange={(open) => setEndOpen(open)}
        open={endOpen}
        placeholder="Max"
        style={{
          marginLeft: -1,
          marginRight: -15,
          width: "calc(50% - 25px)",
          zIndex: 0
        }}
        suffixIcon={<></>}
        value={endDate}
      />
      {props.dateRanges && (
        <Dropdown
          overlay={
            <Menu>
              {Object.keys(props.dateRanges).map((e) => (
                <Menu.Item
                  key={e}
                  onClick={(event) => customRangeClick(e, event)}
                >
                  <Tag
                    className="hoverHand"
                    color={dateKey === e ? "#1890ff" : "#0a3254"}
                    style={{ width: "100%" }}
                  >
                    {props.dateRanges[e].label}
                  </Tag>
                </Menu.Item>
              ))}
            </Menu>
          }
          placement="bottomLeft"
        >
          <Button
            icon={<MoreOutlined />}
            style={{ borderRadius: "0 4px 4px 0", width: 34 }}
            type="primary"
          ></Button>
        </Dropdown>
      )}
    </Row>
  );
};

export default RangePicker2;
