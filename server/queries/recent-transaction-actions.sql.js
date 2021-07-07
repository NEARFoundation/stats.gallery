const { sql } = require('slonik');

module.exports = params => {
  const conditions = [
    sql`(transactions.signer_account_id = ${params.account_id} or transactions.receiver_account_id = ${params.account_id})`,
  ];

  if (params.after_block_timestamp > 0) {
    conditions.push(
      sql`transactions.block_timestamp >= ${params.after_block_timestamp}`,
    );
  }

  if (params.before_block_timestamp > 0) {
    conditions.push(
      sql`transactions.block_timestamp <= ${params.before_block_timestamp}`,
    );
  }

  return sql`
    select transaction_actions.*,
      tx.block_timestamp,
      tx.signer_account_id,
      tx.receiver_account_id,
      tx.included_in_block_hash,
      receipts.included_in_block_hash as receipt_included_in_block_hash,
      blocks.block_height as receipt_included_in_block_height
    from
      (select *
        from transactions
        where ${sql.join(conditions, sql` and `)}
        order by block_timestamp desc) tx
    inner join receipts on tx.converted_into_receipt_id = receipts.receipt_id
    inner join blocks on blocks.block_hash = receipts.included_in_block_hash
    left outer join transaction_actions on tx.transaction_hash = transaction_actions.transaction_hash
    limit 2000
  `;
};
