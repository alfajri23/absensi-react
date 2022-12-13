import React from 'react'

const PrintRekapSiswa= React.forwardRef((props, ref) => {

    var tanggal = [];
    for (var i = 1; i <= 31; i++) {
        tanggal.push(<th key={i+1} scope="col">{i}</th>);
    } 

    return (
      <div ref={ref}>
        <table className="table">
            <thead className="thead-light">
                <tr>
                <th scope="col">No</th>
                <th scope="col">Nama</th>
                {tanggal}
                </tr>
            </thead>
            <tbody></tbody>
        </table>

      </div>
    );
});

export default PrintRekapSiswa