import { Button } from 'antd';
import { useState } from 'react';

const Counts = () => {
    const [count, setCount] = useState(0);

    const handleResetCount = () => {
        setCount(0);
    }

    const handleIncreaseCount = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>{count}</h1>
            <Button className="btn btn-reset" onClick={handleResetCount}>Reset</Button>
            <Button className="btn btn-reset" type="primary" onClick={handleIncreaseCount}>Increase</Button>
        </div>
    )
}

export default Counts;