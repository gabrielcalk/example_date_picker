import "./styles.css";
import { makeServer } from "./Mirage/mirage";
import { Divider } from "antd";

// RangePicker Form
import RangePickerForm from "./Forms/RangePicker/Form";

makeServer();

export default function App() {
  return (
    <>
      <RangePickerForm />
      <Divider />
    </>
  );
}
