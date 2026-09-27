package com.relish.account;

import java.util.UUID;

public interface AccountService {

	// wipes everything Relish holds for this account and the account itself. refuses if the user
	// still owns a restaurant or has delivery history as a courier - that data isnt only theirs.
	void deleteAccount(UUID userId);

}
